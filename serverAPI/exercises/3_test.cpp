#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(MaiorDeDoisNumerosTest, OutputTest)
{
    system("g++ -o aluno_maior aluno_maior.cpp");
    system("echo '8 12' | ./aluno_maior > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "Maior: 12");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
