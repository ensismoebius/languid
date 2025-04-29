#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(MultiplicacaoSimplesTest, OutputTest)
{
    system("g++ -o aluno_mult aluno_mult.cpp");
    system("echo '5 6' | ./aluno_mult > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "Produto: 30");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
