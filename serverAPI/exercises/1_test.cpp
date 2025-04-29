#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(SomaDoisNumerosTest, OutputTest)
{
    system("g++ -o aluno_soma aluno_soma.cpp");
    system("echo '3 4' | ./aluno_soma > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "Soma: 7");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
